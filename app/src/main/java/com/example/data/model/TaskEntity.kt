package com.example.data.model

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import org.json.JSONArray
import org.json.JSONObject

@Entity(
    tableName = "tasks",
    indices = [
        Index(value = ["isCompleted"]),
        Index(value = ["dueDateMillis"]),
        Index(value = ["classCode"]),
        Index(value = ["priority"]),
        Index(value = ["category"])
    ]
)
data class TaskEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String = "",
    val priority: TaskPriority = TaskPriority.SEDANG,
    val category: TaskCategory = TaskCategory.PEKERJAAN,
    val dueDateMillis: Long,
    val dueTimeHour: Int = -1,
    val dueTimeMinute: Int = -1,
    val hasReminder: Boolean = false,
    val reminderEpochMillis: Long? = null,
    val isCompleted: Boolean = false,
    val subTasksJson: String = "[]",
    val isClassTask: Boolean = false,
    val classCode: String = "",
    val authorName: String = "",
    val authorRole: String = "",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
) {
    fun parseSubTasks(): List<SubTask> {
        if (subTasksJson.isBlank()) return emptyList()
        return try {
            val jsonArray = JSONArray(subTasksJson)
            val list = mutableListOf<SubTask>()
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                list.add(
                    SubTask(
                        id = obj.optString("id", i.toString()),
                        title = obj.optString("title", ""),
                        isCompleted = obj.optBoolean("isCompleted", false)
                    )
                )
            }
            list
        } catch (_: Exception) {
            emptyList()
        }
    }

    companion object {
        fun encodeSubTasks(subTasks: List<SubTask>): String {
            val array = JSONArray()
            subTasks.forEach { st ->
                val obj = JSONObject()
                obj.put("id", st.id)
                obj.put("title", st.title)
                obj.put("isCompleted", st.isCompleted)
                array.put(obj)
            }
            return array.toString()
        }
    }
}
